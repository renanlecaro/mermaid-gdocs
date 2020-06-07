# mermaid-gdocs
[Mermaidsjs](https://mermaidjs.github.io/) wrapper for google docs

# Development setup

Run `npm i` followed by `npm start` to have a local server mocking the google api

Run `npm build` and upload index.html to google app scripts to have the editing window.

The `Code.gs` file in the `google scripts` folder is here for reference and as a way to track change,but it is not runned. 

# Side notes

- I was using mermaid.render before, but it turns out that it doesn't work for all charts types. So i'm using mermaid.init now.

- I was including mermaid in node modules, and bundling it with the code, but google app script was brought to its knees because of the 1MB text files. 
So now i'm just grabbing mermaid.min.js from a cdn

- I'm generating a png from the svg because google docs doesn't support svg. I do it at twice the resolution to get better results.

- The mermaid configuration is actually stored as the image meta description in google docs, and then parsed back when editing. The image title is set to an arbitrary string that i then check to be sure that i'm editing a mermaid diagram

- It would be much better to have an editor panel that lets you edit the source of the selected graph, but the lack of onSelectionChange event in docs discouraged me from trying.  

# Todos

- Only tested in chrome

- large graphs may render at low resolutions

- it's still a bit laggy and slow

# License : MIT

Do whatever you want with this code, but i'm not responsible if it breaks. I'm trying to publish it on the google apps store so that people can use it in their google docs

# Screenshots

![Screenshot](docs/sc1.png?raw=true)
![Screenshot](docs/sc2.png?raw=true)
![Screenshot](docs/sc3.png?raw=true)
![Screenshot](docs/sc4.png?raw=true)
