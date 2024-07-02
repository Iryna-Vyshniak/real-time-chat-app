# Real-Time Chat App

This project is a real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io. It supports group and private chat, notifications, audio and video messages, video streaming, image sharing, emojis, replies, and location sharing.

## Features

- **Group and Private Chat:** Communicate in groups or one-on-one.
- **Notifications:** Receive notifications for new messages.
- **Audio and Video Messages:** Send and receive audio and video messages with progress tracking.
- **Video Streaming:** Stream live video.
- **Image Sharing:** Share images within chats.
- **Emojis:** Express yourself with a wide range of emojis.
- **Replies:** Reply to specific messages.
- **Location Sharing:** Share your location in real-time.

## Technologies Used

- **`Frontend:`**
  - React
  - Zustand
  - DaisyUI
  - Framer Motion
  - React Media Recorder
  - React Leaflet
- **`Backend:`**
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - Socket.io
  - Joi
  - Cloudinary
  - JSON Web Tokens
  - Cookie Parser
  - Bcrypt.js
- **`Others:`**
  - dotenv
  - ESLint

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Iryna-Vyshniak/real-time-chat-app.git
   cd real-time-chat-app
   ```

2. Install dependencies:

   ```bash
   npm install
   cd frontend
   npm install
   ```

3. Create `.env` file in the backend directory and add the following environment variables:

```bash
  PORT=5000
  DB_HOST=your_mongo_uri
  NODE_ENV=development
  JWT_SECRET=your_jwt_secret
  CLOUDINARY_CLOUD_NAME=your_cloudinary_name
  CLOUDINARY_API_KEY=your_cloudinary_api_key
  CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret
```

4. Start the development server:

```bash
npm run server

cd frontend
npm run dev
```

5. Open your browser and navigate to http://localhost:3000

## Demo

Check out the live demo: [Real-Time Chat App Demo](https://chat-mern-ujj2.onrender.com/)

| ![Screenshot](/frontend/public/screenshots/Screenshot_2.png)   | ![Screenshot](/frontend/public/screenshots/Screenshot_1.png)   |
| -------------------------------------------------------------- | -------------------------------------------------------------- |
| ![Screenshot](/frontend/public/screenshots/Screenshot_3.png)   | ![Screenshot](/frontend/public/screenshots/Screenshot_4.png)   |
| ![Screenshot](/frontend/public/screenshots/Screenshot_4.1.png) | ![Screenshot](/frontend/public/screenshots/Screenshot_4.2.png) |
| ![Screenshot](/frontend/public/screenshots/Screenshot_5.png)   | ![Screenshot](/frontend/public/screenshots/Screenshot_6.png)   |
| ![Screenshot](/frontend/public/screenshots/Screenshot_7.png)   | ![Screenshot](/frontend/public/screenshots/Screenshot_8.png)   |
| ![Screenshot](/frontend/public/screenshots/Screenshot_9.png)   | ![Screenshot](/frontend/public/screenshots/Screenshot_10.png)  |
| ![Screenshot](/frontend/public/screenshots/Screenshot_11.png)  | ![Screenshot](/frontend/public/screenshots/Screenshot_12.png)  |
| ![Screenshot](/frontend/public/screenshots/Screenshot_13.png)  | ![Screenshot](/frontend/public/screenshots/Screenshot_14.png)  |

## Documentation

For detailed documentation, refer to the [Wiki](https://github.com/Iryna-Vyshniak/real-time-chat-app/wiki).

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License with attribution requirements - see the [LICENSE](LICENSE) file for details.
