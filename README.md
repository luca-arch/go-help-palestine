[![StandWithPalestine](https://github.com/Safouene1/support-palestine-banner/blob/master/StandWithPalestine.svg)](https://github.com/Safouene1/support-palestine-banner)

# go-help-palestine

The website **[go-help-palestine.com](https://go-help-palestine.com)** collects and displays links to charities and individual donation campaigns to support the victims of a conflict that has been ongoing for over a year.

## Technologies Used

Despite its simplicity, the project is built with:

- **Backend**: Golang
- **Frontend**: React + TypeScript
- **Styling**: [styled-component](https://github.com/styled-components/styled-components)
- **Deployment:** [Docker Compose](https://docs.docker.com/compose/)

The set of dependencies is kept at bare minumum.

## Features

### A message from the author

An informative conversation highlighting the importance of awareness and action. The author of this website was utterly convinced he could not make any difference, and thought there was no way to help except from what was being done by activists and donators of large amounts.
He then had the chance to speak with a couple of friends and, luckily, changed his mind.

### Campaigns list

Display a list of verified charities and donation campaigns. Such list is being taken care of by [@sammyobeid](https://www.instagram.com/sammyobeid/) and is publicly available on [this Google Sheet](https://docs.google.com/spreadsheets/d/1pPXurDxcr4VYqPaAXxrrZ6Gh56zTlJzOyeuBSXqEaHk/).

ℹ️ Should you find anything wrong with that list, or should you have any contribution you want to bring to it, feel free to use the contact form on the website, or send an email to **yourpalcharities AT gmail DOT com**!

### User-friendly interface

User-friendly interface for easy navigation and contribution. The design is extremely simple **(any kind of contribution will be appreciated)** and the dependecies list is kept at bare minumum.

## Installation

1. **Clone the repository**

    ```sh
    git clone https://github.com/luca-arch/go-help-palestine.git
    cd go-help-palestine
    ```

2. **Start the application**

    ```sh
    docker compose up --detach
    docker compose logs -f
    ```

That's it! The website can be accessed via [localhost:8080](http://127.0.0.1:8080).

## Development

If you are actively developing, you can stop the Docker Compose deployment and run the services individually.

- **Backend**: cd into the go-application folder and run `go run cmd/server/main.go`.
- **Frontend**: cd into the react-application folder and run `npm install && npm run dev`. Make sure you have Node 20.16.0 or higher installed.

### Telegram notifications

If you want to enable Telegram notifications (otherwise whatever is sent via the Contact Form is only logged to the console), you are going to need to update the `TG_BOT_TOKEN` and `TG_CHANNEL` variables in the [docker-compose file](./docker-compose.yml) - or you can simply create a new `docker-compose.override.yml` file!

To create a bot and a channel/group:

1. Create a new Telegram private group, following [these instructions](https://telegram.org/faq#q-how-do-i-create-a-group).
2. Send a message to [BotFather](https://t.me/botfather) to create a new Telegram bot (it's super easy).
3. Send another message to [IDBot](https://t.me/username_to_id_bot) to retrieve your new bot's Token and the private group's ID, you will need these in the fifth step!

### Contributing

If you want to contribute to the cause (not only the repo), use the [contacts form](https://go-help-palestine.com/contacts)!

Pull requests are welcome too, see the existing [commits list](https://github.com/luca-arch/go-help-palestine/commits/main/) and make sure you understand what all those [emojis](https://gitmoji.dev) mean!

## Repo Directories

### `/backend-application`

The backend application, written in Go. It's split up into smaller modules and uses dependency injection so it can be later extended without too much refactoring.
There is a nice [Makefile](./go-application/Makefile) with a few commands to run tests, code coverage, and generate docs. Run `make` to display the full list of available commands.

### `/react-application`

The SPA that renders the whole website. The site's content and HTML were simple enough not to require an SPA (to be honest, it did not even require any server-side rendering either), but React and TypeScript are so much fun.
Other than `npm run dev`, there should not be any particular command required to work with the SPA, although the [package.json](./react-application/package.json) file does contain some.

## TODO list

- [x] Use Docker to orchestrate the individual apps
- [ ] Validate the links scraped from the Google Sheet, some of them are already returning a 404 and should not be exposed.
- [ ] Add a click counter to prioritise less successful campaigns. There are almost 200 individual campaigns already!
- [ ] Add tests!
- [x] Check UI on OSX browsers.
- [ ] Check UI on older Android Phones.
- [ ] Check UI on iOS tablets.
