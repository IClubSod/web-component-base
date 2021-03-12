/**
 * This base class for web components provides critical common functions for web components
 * such as loading them (and their templates) into the browser context.
 */
class WebComponent extends HTMLElement {
    /**
     * Async function to register a web component by first optionally loading an HTML template into the DOM
     * then registering the class in the custom element registry. 
     * @param {*} customClass - The custom class constructor to use to register the component in the registry
     * @param {string} customElementTag - The custom tag to use for this component (must be hyphenated)
     * @param {string} [template=null] - An optional template file which should be loaded before registering this component
     */
    static async register(customClass, customElementTag, template = null) {
        // If there is a template file to load, do that before registering the component
        if (template != null) {
            let response = await window.fetch(template)
            if (!response.ok) {
                throw new Error(`Error loading template from ${template} : HTTP status ${response.status} - ${response.statusText}`)
            }

            // Insert the template file contents into the document body before the closing tag.
            // This seems to be as good a place as any to keep templates for the current document.
            document.body.insertAdjacentHTML("beforeend", await response.text())
        }

        // Register the component as a custom element
        window.customElements.define(customElementTag, customClass)
    }

    /**
     * WebComponent constructor with optional array of templates IDs to load during construction
     * @param {Array<string>} [templates=null] - An array of template IDs to load at construction
     */
    constructor(templates = null) {
        super()
        if (templates !== null) {
            for (const template of templates) {
                this.loadTemplate(template)
            }
        }
    }

    /**
     * Loads the named template into the shadow DOM for this component, attaches a shadow if one does not exist
     * @param {string} templateID - The ID of the template, which must already be loaded into the DOM via WebComponent.register
     */
    loadTemplate(templateID) {
        const template = document.getElementById(templateID)
        if (template === null || !(template instanceof HTMLTemplateElement) || template.content === null) {
            throw new Error(`Unable to load template with id=${templateID}, make sure the template is properly loaded into the DOM and the id is correct.`)
        }
        
        if (this.shadowRoot === null) {
            this.attachShadow({mode:"open"})
        }
        
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
}

export default WebComponent