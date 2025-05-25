# Todo App with Redux Toolkit

A modern Todo application built with Next.js, TypeScript, Redux Toolkit, and Tailwind CSS. This application demonstrates best practices in React development and state management.

## Features

- ✨ Modern UI with Tailwind CSS
- 🔄 Redux Toolkit for state management
- 📱 Responsive design
- ⚡ TypeScript for type safety
- 🎯 Pomodoro Timer integration
- 🔍 Advanced filtering and search
- 💾 Local storage persistence
- 🌙 Dark/Light theme support

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Icons:** Lucide Icons

## Project Structure

```
todo-redux-app/
├── app/                 # Next.js app directory
├── components/         # React components
│   ├── ui/            # Base UI components
│   └── ...            # Feature components
├── lib/               # Utilities and Redux store
├── hooks/             # Custom React hooks
├── styles/            # Global styles
└── public/            # Static assets
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd todo-redux-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features in Detail

### Todo Management

- Add new todos
- Mark todos as complete/incomplete
- Delete todos
- Filter todos (All/Active/Completed)
- Clear completed todos

### Pomodoro Timer

- Customizable work/break intervals
- Visual timer display
- Sound notifications
- Session tracking

### Advanced Features

- Debounced search
- Local storage persistence
- Responsive design
- Theme switching
- Mobile-friendly interface

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
