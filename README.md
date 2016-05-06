# Web Stack Exercise

Your mission, should you choose to accept it, is to build a simplified
[Trello](http://trello.com) clone.

Trello is a simple task management tool with three components: boards, lists and cards.
Each board has multiple list, each list has multiple cards, and cards have names. 
[Here's what Trello looks like.](https://trello.com/b/VD0XOCe7/example-board)

![Trello example board](static/img/trello-board.png)

In this exercise, we'll be building **a single Trello-like board.**

## Your tasks

Don't try to do all of these tasks at once. Tackle them one at a time and move
on once you've completed task. It's OK if you don't complete all tasks, we give
partial credit :white_check_mark:.

 1. View lists, create new list **\[frontend\]**
    <br> Allow users to view and
    create lists. Lists should be displayed as vertical columns in a
    Trello-like manner.
    <br>Use: `GET /api/lists` and `POST /api/lists`.
 1. Fix `POST /api/list/:id` endpoint **\[backend\]**
    <br> There's a bug :beetle: in the API endpoint for updating `List`s in
    [`app.js`](app.js). Find it and fix it.
 1. Create new card in a list **\[frontend\]**
    <br> Allow users to create new cards in existing lists.
    <br>Use: `POST /api/lists/:id`.
 1. Rename list **\[frontend\]**
    <br>Allow users to rename existing lists.
    <br>Use: `POST /api/lists/:id`.
 1. Change card contents **\[frontend\]**
    <br>Allow users to change the contents of cards.
    <br>Use: `POST /api/lists/:id`.
 1. Delete card **\[frontend\]**
    <br>Allow users to delete single cards.
    <br>Use: `POST /api/lists/:id`.
 1. Move cards **\[frontend\]**
    <br>Allow users to move cards within and between lists.
    <br>Use: `POST /api/lists/:id`.
 1. Reorder lists **\[frontend\]**
    <br>Allow users to reorder whole lists. You can use drag-and-drop or buttons.
    <br>Use: `POST /api/lists/:id`.
 1. Implement `DELETE /api/lists/:id` **\[backend\]**
    <br>Create a new Express endpoint that takes a `DELETE` request and an `id`
    and deletes a single list.  This endpoint should return `404 Bad Request`
    if list with `id` can't be found. 
 1. Delete list **\[frontend\]**
    <br>Allow users to delete whole lists.
    <br>Use: `DELETE /api/lists/:id`.

Legend:

 * **\[frontend\]**: Task involves work in the browser with HTML, CSS and JavaScript.
 * **\[backend\]**: Task involves work in the server with [Node][node] and [Express][express]

## Submitting

 1. Make sure all your changes are committed to `git`.
    ```bash
    $ git status
    On branch master
    nothing to commit, working directory clean
    ```
 1. Create a zip archive of your project.
    ```bash
    $ git archive master --format zip -o "horizonello-[YOUR NAME].zip"
    ```
 1. Email us `horizonello-[YOUR NAME].zip`.

## Evaluation

You work will be evaluated based on the following criteria (in decreasing order of importance):

 * Correctness (most important): The features you implement work correctly.
   There are no errors in the console. It's not easy to make your code break.
 * Completeness: Every feature is implemented.
 * Visual styling and ease of use (least important): The user interface is easy
   to use and looks good.

## Schema

We represent our Trello-like board using a single entity: `List`s. Our board
has cards too but every card lives under a `list`. You can't create a card
without a list.

`List`s have the following properties:

  * `id` (integer) (required): Provided by the storage layer. Uniquely
    identifies each `list`.
  * `name` (string) (required): Name of the `list`.
  * `pos` (integer) (required): Position of the list on the board. Lists should
    be displayed in increasing `pos` order from left to right. So `pos` 0 is
    the leftmost list. 
  * `cards` (array of strings) (optional): Each string in this array represents
    a card on the list. These cards should be displayed in top to bottom order.
    In other words, first card in this array should be the topmost card in the
    current list.

Example valid `List`:

```json
{
  "id": 0,
  "name": "List name",
  "pos": 0,
  "cards": ["Card 1", "Card 2"]
}
```

## Backend

We provide a simple backend in [Express][express] for you.


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

[express]: http://expressjs.com/en/api.html
[express-handlebars]: https://github.com/ericf/express-handlebars
[node]: https://nodejs.org/api/
