/// <reference types="@wdio/globals" />

export class ContactFormSection {
  async locateSection() {
    // Heuristic: look for a Role* label or a form containing required fields
    return $('form');
  }

  async requiredFieldLabels(): Promise<string[]> {
    const form = await this.locateSection();
    const labels = await form.$$('*= *'); // naive; refine if needed
    const req: string[] = [];
    for (const l of labels) {
      const txt = (await l.getText()).trim();
      if (txt.endsWith('*')) req.push(txt);
    }
    return req;
  }
}
