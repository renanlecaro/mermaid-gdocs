# mermaid-gdocs
[Mermaidsjs](https://mermaidjs.github.io/) wrapper for google docs

# Development setup

The `Code.gs` file in the `google scripts` folder is here for reference and as a way to track change,but it is not runned. 

The index.html file is where the editor UI lies

# Side notes

- I was using mermaid.render before, but it turns out that it doesn't work for all charts types. So i'm using mermaid.init now.

- I'm generating a png from the svg because google docs doesn't support svg. I do it at twice the resolution to get better results.

- The mermaid configuration is actually stored as the image meta description in google docs, and then parsed back when editing. The image title is set to an arbitrary string that i then check to be sure that i'm editing a mermaid diagram

- It would be much better to have an editor panel that lets you edit the source of the selected graph, but the lack of onSelectionChange event in docs discouraged me from trying.  

# License : MIT

Do whatever you want with this code, but i'm not responsible if it breaks. I'm trying to publish it on the google apps store so that people can use it in their google docs
 