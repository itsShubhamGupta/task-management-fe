# 📋 TaskFlow — Frontend (Angular)

A clean, responsive Task Management UI built with **Angular**, consuming a Spring Boot REST API.

🔗 **Live Demo:** [https://quicktask-manager-app.netlify.app](#)
🔗 **Backend Repo:** [https://github.com/itsShubhamGupta/task-management-fe](#)

---

## ✨ Features

- ✅ Create, view, complete, and delete tasks
- 📊 Dashboard summary — Total / Pending / Completed tasks
- 🔍 Search & filter 
- 📱 Fully responsive UI
- ⚠️ Form validation with inline error messages

## 🛠️ Tech Stack

`Angular` `TypeScript` `RxJS` `HTML5/CSS3` `Netlify`

## 🚀 Getting Started

```bash
git clone https://github.com/<your-username>/taskflow-frontend.git
cd taskflow-frontend
npm install
ng serve
```
App runs at `http://localhost:4200`

## ⚙️ Configuration

Update the API base URL in `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/tasks'
};
```

## 📁 Project Structure

```
src/app/
├── components/
│   ├── task-list/
│   ├── task-form/
│   └── dashboard/
├── services/
│   └── task.service.ts
├── models/
│   └── task.model.ts
```

## 🏗️ Build

```bash
ng build --configuration production
```

---
