# GTreasury NPV Calculator

## About
A full-stack web application designed to calculate the Net Present Value (NPV) for a given set of cash flows over a range of discount rates. This project was built as a coding assessment to demonstrate best practices in modern web development.

At its core, this isn't just a calculator. It’s a showcase of how a robust, real-world application can be structured. It features a clean separation between a .NET backend API and a Next.js frontend, communicating asynchronously. The most compelling feature is the real-time streaming of results—as the backend calculates each NPV value, it's pushed immediately to the frontend and displayed on a chart and table, giving the user instant feedback without waiting for the full computation to finish.

## Backend
The backend is a .NET 8 Web API responsible for handling all business logic and calculations. It's built with a clean, layered architecture to ensure separation of concerns and testability.

### Technologies Used
- .NET 8 with C#
- ASP.NET Core Web API for creating the RESTful service
- xUnit for unit testing the core business logic

### Running Locally
To get the backend server running on your machine, follow these steps:

1.  Navigate to the backend directory:
```bash
cd backend
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Build the solution
```bash
dotnet build
```

4. Run the API
```bash
dotnet run --project GTreasury.NPV.Api/GTreasury.NPV.Api.csproj
```
The API will now be running and accessible at https://localhost:7251.
If this does not work, run that from Visual Studio.

5. (Optional) Run tests
```bash
dotnet test
```

## Frontend
The frontend is a responsive, single-page application (SPA) built with Next.js. It provides the user interface for inputting data and visualizes the results streamed from the backend in real-time.

### Technologies Used
- Next.js (v15) with React (19)
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for the component library
- amCharts 5 for data visualization
- React Hook Form & Zod for powerful and type-safe form validation

### Running Locally
To launch the frontend development server, follow these steps:

1.  Navigate to the backend directory:
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```
The application will now be available in your browser at http://localhost:3000.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ♥ &nbsp;by Raphael Socolowski 👋 &nbsp;[Check my linkedin out](https://www.linkedin.com/in/raphaelswk/)