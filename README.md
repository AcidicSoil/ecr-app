# ecr-app

**ecr-app** is a web application designed to calculate costs based on various user inputs. The app allows users to add items with specific prices and quantities, include optional hardware and software labor, and search for available services. The application is built using React and Material-UI, and it's backed by a JSON file that contains service data.

## Table of Contents

- [ecr-app](#ecr-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Adding Items:](#adding-items)
    - [Service Search:](#service-search)
    - [Copying Values:](#copying-values)
  - [Available Scripts](#available-scripts)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **Item Calculation:** Add items with specific prices and quantities, and calculate the total with optional hardware and software labor.
- **Service Search:** Search for available services and view details such as cost and time.
- **Expandable Service List:** Expand or minimize the list of available services with a dropdown arrow.
- **Copy to Clipboard:** Copy the calculated total values to the clipboard for easy use.

## Installation

To get started with **ecr-app**, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ecr-app.git
   cd ecr-app
   ```

2. **Install dependencies:**
   - If you are using npm:
     ```bash
     npm install
     ```
   - Or if you prefer Yarn:
     ```bash
     yarn install
     ```

3. **Start the development server:**
   - Using npm:
     ```bash
     npm start
     ```
   - Using Yarn:
     ```bash
     yarn start
     ```

   This will start the app on `http://localhost:3000`.

## Usage

### Adding Items:
- Enter the price and quantity of the item.
- Optionally, include hardware or software labor by checking the respective checkboxes and entering the number of hours.

### Service Search:
- Use the search bar to find services by name. The results will include the service name, description, cost, and time.
- Click the dropdown arrow to expand or minimize the list of all available services.

### Copying Values:
- After calculation, use the "Copy" button to copy the total value to your clipboard.

## Available Scripts

In the project directory, you can run:

- `npm start` or `yarn start` - Runs the app in development mode.
- `npm run build` or `yarn build` - Builds the app for production.

## Contributing

Contributions are welcome! If you’d like to contribute to **ecr-app**, please fork the repository and use a feature branch. Pull requests are warmly welcome.

1. Fork the repo.
2. Create your feature branch (`git checkout -b feature-branch-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

