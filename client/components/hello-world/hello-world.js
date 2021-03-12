import WebComponent from "/web-component.js"

class HelloWorldComponent extends WebComponent {
    constructor() {
        // Load our default template into the shadow root at construction (this takes an array of IDs)
        super(["hello-world-template"])
    }

    GetName() {
        return this.textContent
    }
}

// Note: we need to use import.meta so that we can keep our template file with the component code
// and not have to update anything if we reorganize the file structure.
WebComponent.register(
    HelloWorldComponent, // Our custom class defined above
    "hello-world", // The custom element name
    new URL("hello-world.html", import.meta.url).toString() // Path to the HTML5 template file to load into the DOM
)
