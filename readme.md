# EasyTrip: AI-Powered Travel Planning Platform

## 🌍 Project Overview

EasyTrip is a **full-stack project** built to explore and implement real-world web development concepts and AI integration. The goal of this project is to **learn and apply modern technologies** by creating a platform that simplifies travel planning:

* Generate smart itineraries based on user preferences.
* Integrate interactive maps and real-time weather updates.
* Automate content creation such as travel blogs and vlogs.
* Organize and share trip photos and videos.

This project demonstrates skills in **full-stack development**, **AI-powered applications**, and **modern web technologies**.

---

## 🚀 Features

* **Smart Itinerary Generation**: Plan trips based on user inputs such as destinations, duration, and travel preferences.
* **Interactive Map Integration**: Visualize routes and points of interest dynamically.
* **Real-Time Weather Updates**: Adjust travel plans based on current weather conditions.
* **Blog and Vlog Automation**: Automatically generate travel blogs and video vlogs.
* **Image and Video Management**: Organize and search media using AI-assisted text queries.

---

## 🛠️ Tech Stack

* **Frontend**: React / Next.js + Tailwind CSS
* **Backend**: Node.js + Express 
* **Database**: Relational database (PostgreSQL / MySQL)
* **AI Integration**: OpenAI GPT for natural language processing and content generation

---

## 📁 Project Structure

```
project-root/
 ├─ client/        # Frontend application
 ├─ server/        # Backend API and database logic
 └─ .gitignore     # Root gitignore
```

---

## ⚙️ Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/Gvenkatanarasimha05/easytrip1.git
cd easytrip1
```

2. Install dependencies:

```bash
npm install
```

3. Add environment variables:

```bash
cp .env.example .env
```

4. Apply database migrations and generate Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the development server:

```bash
npm run dev
```

---

## 📦 Deployment

* Build the project:

```bash
npm run build
npm start
```
