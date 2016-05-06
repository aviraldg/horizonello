# Introduction

Your mission, should you choose to accept it, is to build a very simple [Trello](http://trello.com) clone.

Trello is a very simple task management tool that has two basic components: lists and cards.

 * Build client create
 * Debug update


## Project Layout

We use [Express][express] on the server side. We've set up [`express-handlebars`][express-handlebars] for templating for you.

The index page lives in [`views/index.handlebars`](views/index.handlebars). The
boilerplate and header footer code lives in [`views/layouts/main.handlebars`](views/layouts/main.handlebars).

Static assets live in the `static/` folder.
CSS styles live in that's ready for editing in [`static/css/styles.css`](static/css/styles.css).
The client-side 

The main Express script file is [`app.js`](app.js). You can find the route definitions here.

[`storage.js`](storage.js) contains persistence logic.
app.js

storage.js

### Schema

There's only one entity type in this application: `List`s.

```json
{
  "name": "List name",
  "pos", 1,
  "cards", ["Card 1", "Card 2"]
}
```

### API Endpoints

#### Get all lists
 * Method: `GET`
 * Path: `/api/list`
 * Response codes and contents
     * 200: Success. Response will contain an object with a single key `rows`, all `list` objects are returned under this.
       ```
       {
         "rows": [{"name": "List name", "pos": 1, "cards": ["Card 1"]}]
       }
       ```

#### Create new list

 * Method: `POST`
 * Path: `/api/list`
 * Request parameters: All request parameters are expected to be passed in through the request body (i.e. not the URL).
     * name (required): name of the list
     * pos  (required): number representing the position of this list on the screen. `pos` counts up left-to-right.
     * cards (optional): array of strings representing cards under the current list.
 * Responses:
     * 200: Success. Response will be the `list` object that was just created.
     * 400: Invalid request. Missing required fields or bad field values. Check the logs.

#### Update existing list

 * Method: `POST`
 * Path: `/api/list`
 * Request parameters: All request parameters are expected to be passed in through the request body (i.e. not the URL).
     * name (required):
     * pos (required):
 * Responses:
     * 200: Success. Response will be the `list` object that was just created.
     * 400: Invalid request. Missing required fields or bad field values. Check the logs.

## Client

[express]: XXX
[express-handlebars]: XXX
