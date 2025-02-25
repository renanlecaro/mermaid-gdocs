# mermaid-gdocs
[Mermaidsjs](https://mermaidjs.github.io/) wrapper for google docs


# known limitations

- only inline images work in google docs
- icons (fontawesome) not supported

# Development setup

To test the editor ui outside of google docs, serve the src folder, for example `npx http-server src` and open http://127.0.0.1:8080 in your browser.

`src/Code.gs` is a copy of what's running in apps script, same for  `src/appsscript.json`.  

# License : MIT

Do whatever you want with this code, but i'm not responsible if it breaks. I'm trying to publish it on the google apps store so that people can use it in their google docs

# Sample graphs 

This one is good to bebug scaling issues

    graph TB
        sq[Square shape] --> ci((Circle shape))
    
        subgraph A
            od>Odd shape]-- Two line<br/>edge comment --> ro
            di{Diamond with <br/> line break} -.-> ro(Rounded<br>square<br>shape)
            di==>ro2(Rounded square shape)
        end
    
        %% Notice that no text in shape are added here instead that is appended further down
        e --> od3>Really long text with linebreak<br>in an Odd shape]
    
        %% Comments after double percent signs
        e((Inner / circle<br>and some odd <br>special characters)) --> f(,.?!+-*ز)
    
        cyr[Cyrillic]-->cyr2((Circle shape Начало));
    
         classDef green fill:#9f6,stroke:#333,stroke-width:2px;
         classDef orange fill:#f96,stroke:#333,stroke-width:4px;
         class sq,e green
         class di orange
    
Another big one

    sequenceDiagram
        participant web as Web Browser
        participant blog as Blog Service
        participant account as Account Service
        participant mail as Mail Service
        participant db as Storage
    
        Note over web,db: The user must be logged in to submit blog posts
        web->>+account: Logs in using credentials
        account->>db: Query stored accounts
        db->>account: Respond with query result
    
        alt Credentials not found
            account->>web: Invalid credentials
        else Credentials found
            account->>-web: Successfully logged in
    
            Note over web,db: When the user is authenticated, they can now submit new posts
            web->>+blog: Submit new post
            blog->>db: Store post data
    
            par Notifications
                blog--)mail: Send mail to blog subscribers
                blog--)db: Store in-site notifications
            and Response
                blog-->>-web: Successfully posted
            end
        end

An excellent example from canonical

    graph TD;
        A["Create Video Issue in Backlog"] --> B["Assign 10 Points"];
        B --> C["Move to 'In Progress'"];
        C --> D["Video Template Appears in Description"];
        D --> E["Move to 'In Review' for Content Team"];
        E --> F["Ensure Issue Contains Copy Doc"];
        F --> G["Issue Visible in Review Board"];
        G --> H["Comment Appears Tagging Content Team"];
        H --> I["Content Team Assigns T-Shirt Size"];
    
        I -->|Not Satisfied| J["Move Back to 'In Progress'"];
        I -->|Satisfied| K["Assign to 'Pending Marketing Acceptance' & Tag Marketing Manager"];
    
        K --> L["Marketing Manager Notifies Social Media Team"];
        L --> M["Create Ticket or Add to Campaign Epic"];
    
        K -->|Ready & Approved| N["Brief Design Team & Move to 'In Design'"];
        N --> O["Complete Design Brief Subtask (Creates Linked Issue in Brand Project)"];
        O --> P["Brand PM Acknowledges & Informs Planning"];
    
        P --> Q["Designer Moves Task to 'In Progress'"];
        Q --> R["Designer Moves Task to 'In Review' & Uploads File"];
        R --> S["Tag Requestor & Stakeholders for Review"];
        S --> T["Designer Iterates Based on Feedback"];
    
        T -->|Design Approved| U["Upload Final Version to Design Drive & Paste Link in Jira"];
        U --> V["Set Task Status to 'Done'"];
        V --> W["Design Team Marks Linked Issue as Done"];
        W --> X["Video Issue Owner Marks as 'Marketing Ready' & Tags Marketing Team"];
    
        X -->|Published| Y["Issue Owner Marks as 'Done'"];
