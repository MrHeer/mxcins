import { SELECTOR } from './utils';

export default class VariablesOutputPostProcessor {
  public filename = '';

  constructor(_: any, filename: any) {
    this.filename = filename;
  }

  // eslint-disable-next-line class-methods-use-this
  process(css: any) {
    // Find the dummy selector in the output CSS
    const selectorStart = css.indexOf(SELECTOR);
    const selectorEnd = css.lastIndexOf('}');
    const selectorContents = css.slice(selectorStart + SELECTOR.length + 2, selectorEnd).trim();

    // Parse the dummy selector's contents into a regular JSON-y object
    const json = selectorContents.split(';').reduce((memo: any, variable: any) => {
      if (variable) {
        const [name, value] = variable.split(':');
        memo[name.trim()] = value.trim();
      }

      return memo;
    }, {});

    // Pretty print the JSON
    const contents = JSON.stringify(json, undefined, 2);

    // Write the variables to the given filename, creating
    // directories as we go if not present using mkdirp
    // mkdirp.sync(path.dirname(this.filename));
    // fs.writeFileSync(this.filename, contents);

    // Remove the dummy selector from the output
    // return css.slice(0, selectorStart);
    return contents;
  }
}
