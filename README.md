# Introduction

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

 1. Create new list **\[frontend\]**: Build a way to create a new 
 1. Create new card in a list **\[frontend\]**:
 1. Fix `POST /api/list/:id` endpoint **\[backend\]**: 
 1. Rename list **\[frontend\]**:
 1. Rename card **\[frontend\]**:
 1. Delete card **\[frontend\]**:
 1. Move card between lists **\[frontend\]**:
 1. Reorder lists **\[frontend\]**:
 1. Implement `DELETE /api/lists/:id` **\[backend\]**:
 1. Delete list **\[frontend\]**:

Legend:

 * **\[frontend\]**: Task involves work in the browser with HTML, CSS and JavaScript.
 * **\[backend\]**: Task involves work in the server with [Node][node] and [Express][express]

## Submitting

XXX

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
