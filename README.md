# BiteSpeed Backend Developer Task

This project task is a simple backend service built with Express and Prisma, utilizing SQLite as the database. It includes functionality for managing contact information with operations to create and retrieve contacts based on email or phone number.

## API Endpoint:

The app is deployed using [Render.com](render.com), and is available to test the `/identify` endpoint at `https://bitespeed-task-rhythm.onrender.com/identify`.

As I have deployed the app on the free tier of Render.com, the initial response might take ~50 seconds to arrive as Render.com spins down the instance when there is no activity. To resolve this simply visit the endpoint `https://bitespeed-task-rhythm.onrender.com/identify` so as to wake the instance up.

- Method: `POST`
- Request Body:

```sh
{
  "email" : "example@domain.com",
  "phoneNumber" : "123456"
}
```
- Response:

```bash
{
  "contact":  {
    "primaryContatctId": number,
    "emails": string[], // first element being email of primary contact
    "phoneNumbers": string[], // first element being phoneNumber of primary contacts.
    "secondaryContactIds": number[] // Array of all Contact IDs that are "secondary".
  }
}
```

## Getting Started

To get the project up and running on your local machine, follow these steps.

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:

```sh
git clone https://github.com/itisohm/bitespeed-task-rhythm.git
```

2. Navigate to the project directory:
```sh
cd bitespeed-task-rhythm
```

3. Install the dependencies:
```sh
npm install
```
or if you use yarn:
```sh
yarn install
```

4. Set up the environment variables in the root directory:
```sh
DATABASE_URL = "url-to-your-database" // postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public
PORT = 3000
```

5. Run the Prisma migrations to set up the database:
```sh
npx prisma migrate dev
```

6. Start the server (seeds the database first):
```sh
npm run start
```
