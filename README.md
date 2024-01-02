# Live News Front

This is an app generated using the [Quasar Framework](https://quasar.dev/) and is meant to be refactored and improved to show your technical skills and proficiency in Vue.js.

The app consists off the following functionalities:

- **Authentication**: it now allows for any username to be logged in, you will just need to provide a complex enough password.
- **Init jauge**: A jauge displaying the process of loading data inside the app, when it reaches 100%, the user is redirected the the Index page.
- **Index**: it displays a list of posts

## Prerequisites

You will need node version ^19.7 to run the application on your local environment.

## Install the dependencies

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
yarn  dev
```

## TODOS

Ideally, you will make one (1) commit for each of the following tasks:

- [x] Preload the users avatar
      So that there is no delay when displaying the user's avatar
      Use the init jauge page to prefetch all the users and their avatar
      ![Avatar not displayed while loading](https://sowellapp-my.sharepoint.com/personal/fandresena_sowellapp_com/Documents/Test%20embauche%20Senior/task-1.png)

- [x] Store the first 10 Posts locally using [PouchDB](https://pouchdb.com/) (or any equivalent package)
      So that there is no loading required when we land on the Index page, and make the app work offline
      Use the init jauge page to prefetch the 10 initial Posts
- [ ] Load 10 more Posts when we scroll to the bottom of the page
      Store the new Posts locally as well and when we refresh the page, all stored Posts can directly be viewed without calling the API.
      We will first load and display all Posts stored locally before attempting to call the API for more Posts

- [ ] Prefetch all Posts
      Use the init jauge page to prefetch ALL the Posts created as the user logs in
      All the Posts should be displayed progressively 10 by 10 locally, without any need of internet connection on the Index page.

- [ ] Sync new Posts
      On the Index page, periodically call the API to fetch new created Posts and store them locally
      Start and Stop the API generation job to simulate new Posts created
      Display newly created Posts on TOP of the list

**NB:** at all time, Posts will be displayed ordered by updated-at time, descending

## General test criteria

You are free to make any changes to the whole codebase to gain performance, maintainability and improve user experience.

The main aspects we are looking for is:

- clean and readable code
- good use of Vue 3 API
- short template with reusable components
- separation of concerns among the different parts of the codebase
- your ability to explain and argue why you chose to refactor or change parts of the codebase
