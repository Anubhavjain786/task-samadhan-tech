import { Attachment } from 'nodemailer/lib/mailer';
import { GENERIC_MAIL, RAW_MAIL, VIEW_BASED_MAIL } from './constants';
import { MailData, MailType } from './interfaces';
import { MailmanService } from './service';
import * as ejs from 'ejs';
import * as path from 'path';
import mjml2html from 'mjml';
import {
  Message$Component$Image,
  Message$Component$Action,
  Message$Component$Greeting,
  Message$Component$Line,
  Message$Component$StyleConfig,
} from './interfaces/message';
import { minify } from 'html-minifier';

export class MailMessage {
  private mailSubject?: string;
  private viewFile?: string;
  private payload?: Record<string, any>;
  private mailType: MailType;
  private compiledHtml: string;
  private attachments: Record<string, Attachment>;
  private templateString: string;

  constructor() {
    this.attachments = {};
    this.compiledHtml = '';
    this.mailType = RAW_MAIL;
  }

  /**
   * static method to create new instance of the MailMessage class
   */
  static init(): MailMessage {
    return new MailMessage();
  }

  /**
   * Define subject of the mail
   * @param subject
   */
  subject(subject: string): this {
    this.mailSubject = subject;
    return this;
  }

  /**
   * Define the view to be used for the mail
   * @param viewFile
   * @param payload
   */
  view(viewFile: string, payload?: Record<string, any>): this {
    this.mailType = VIEW_BASED_MAIL;
    this.viewFile = viewFile;
    this.payload = payload;
    return this;
  }

  /**
   * Define the template string to be used for the mail
   * @param template
   * @param payload
   */
  raw(template: string, payload?: Record<string, any>): this {
    this.mailType = RAW_MAIL;
    this.templateString = template;
    this.payload = payload;
    return this;
  }

  /**
   * Add attachment to the mail
   * @param greeting
   */
  attach(filename: string, content: Omit<Attachment, 'filename'>): this {
    this.attachments[filename] = { ...content, filename };
    return this;
  }

  /**
   * ==> Generic Template Method <==
   * Use this method for adding the greeting to the generic mail
   * @param greeting
   */
  greeting(
    text: Message$Component$Greeting,
    style?: Message$Component$StyleConfig,
  ): this {
    this._setGenericMailProperties();
    style = style || {};
    this.payload!._fields.push({ type: 'greeting', payload: { text, style } });

    return this;
  }

  /**
   * ==> Generic Template Method <==
   * Use this method for adding a text line to the generic mail
   * @param line
   */
  line(
    text: Message$Component$Line,
    style?: Message$Component$StyleConfig,
  ): this {
    this._setGenericMailProperties();
    style = style || {};
    this.payload!._fields.push({ type: 'line', payload: { text, style } });
    return this;
  }

  /**
   * ==> Generic Template Method <==
   * Use this method for adding a url action to the generic mail
   * @param text
   * @param link
   */
  action(
    options: Message$Component$Action,
    style?: Message$Component$StyleConfig,
  ): this {
    this._setGenericMailProperties();
    style = style || {};
    this.payload!._fields.push({
      type: 'action',
      payload: { ...options, style },
    });
    return this;
  }

  /**
   * ==> Generic Template Method <==
   * Use this method for adding an image to the generic mail
   * @param text
   * @param link
   */
  image(
    options: Message$Component$Image,
    style?: Message$Component$StyleConfig,
  ): this {
    this._setGenericMailProperties();
    style = style || {};
    this.payload!._fields.push({
      type: 'image',
      payload: { ...options, style },
    });
    return this;
  }

  /**
   * ==> Generic Template Method <==
   * Use this method for adding a divider to the generic mail
   * @param text
   * @param link
   */
  divider(style?: Message$Component$StyleConfig): this {
    this._setGenericMailProperties();
    style = style || {};
    this.payload!._fields.push({ type: 'divider', payload: { style } });
    return this;
  }

  /**
   * ==> Generic Template Method <==
   * Use this method for adding a divider to the generic mail
   * @param text
   * @param link
   */
  table(
    options: Record<string, any>,
    style?: Message$Component$StyleConfig,
  ): this {
    this._setGenericMailProperties();
    style = style || {};
    this.payload!._fields.push({
      type: 'table',
      payload: { style, ...options },
    });
    return this;
  }

  /**
   * ==> Generic Template Method <==
   * Use this method for adding a divider to the generic mail
   * @param text
   * @param link
   */
  card(
    options: Record<string, any>,
    style?: Message$Component$StyleConfig,
  ): this {
    this._setGenericMailProperties();
    style = style || {};
    this.payload!._fields.push({
      type: 'card',
      payload: { style, ...options },
    });
    return this;
  }

  /**
   * ==> Generic Template Method <==
   * Use this method for adding a divider to the generic mail
   * @param text
   * @param link
   */
  regards(style?: Message$Component$StyleConfig): this {
    this._setGenericMailProperties();
    style = style || {};
    this.payload!._fields.push({
      type: 'regard',
      payload: { style, text: 'Team Blackopal' },
    });
    return this;
  }

  /**
   * ==> Generic Template Method <==
   * Use this method for adding a divider to the generic mail
   * @param text
   * @param link
   */
  markdown(text: string, style?: Message$Component$StyleConfig): this {
    this._setGenericMailProperties();
    style = style || {};
    this.payload!._fields.push({ type: 'raw', payload: { style, text } });
    return this;
  }

  /**
   * ==> Generic Template Method <==
   */
  private _setGenericMailProperties() {
    this.mailType = GENERIC_MAIL;
    if (!this.payload || !this.payload._fields) {
      this.payload = { _fields: [] };
    }
  }

  /**
   * Method to compile templates
   */
  private async _compileTemplate(): Promise<string> {
    if (this.compiledHtml) return this.compiledHtml;

    const config = MailmanService.getConfig();
    const header = ejs.renderFile(
      path.join(config.path || '', '_common/header.ejs'),
      {},
      { root: config.path },
    );

    const footer = ejs.renderFile(
      path.join(config.path || '', '_common/footer.ejs'),
      {},
      { root: config.path },
    );

    let content = '';
    if (this.mailType === VIEW_BASED_MAIL) {
      content = await ejs.renderFile(
        path.join(config.path || '', this.viewFile),
        this.payload,
        { root: config.path },
      );
    } else {
      content = await ejs.renderFile(
        path.join(config.path || '', `_common/generic.ejs`),
        this.payload,
        { root: config.path },
      );
    }

    const [c1, c2, c3] = await Promise.all([header, content, footer]);

    const template = mjml2html(`${c1}${c2}${c3}`);
    this.compiledHtml = minify(template.html, {
      minifyCSS: true,
      removeAttributeQuotes: true,
    });
    return this.compiledHtml;
  }

  /**
   * Returns the maildata payload
   */
  async getMailData(): Promise<MailData> {
    if (typeof (this as any).handle === 'function') {
      (this as any)['handle']();
    }

    return {
      subject: this.mailSubject,
      html: await this._compileTemplate(),
      attachments: Object.values(this.attachments),
    };
  }

  /**
   * Render the email template.
   * Returns the complete html of the mail.
   */
  async render(): Promise<string> {
    return this._compileTemplate();
  }
}
