# Decentrawill

## Overview

Decentrawill revolutionizes the way wills are created, managed, and executed. In the traditional process of setting up a will, individuals often face challenges such as notary fraud, time-consuming procedures, and the risk of will alteration. Decentrawill eliminates these issues by leveraging blockchain technology, offering a transparent, immutable, and secure platform for automating the terms of wills. Our platform enables testators to have full control over their assets with the flexibility to set their desired conditions and deadlines. By reducing the intermediaries involved, Decentrawill not only simplifies the process but also significantly decreases the potential for fraud, making the transfer of assets seamless and trustworthy.

## Similar Projects and Differentiation

Several projects have ventured into the space of blockchain-based wills, such as Blockchain Testament and CryptoWill. However, Decentrawill distinguishes itself in several key aspects:

- **Identity Verification:** Unlike Blockchain Testament, Decentrawill plans to integrate with Plaid for robust identity verification, enhancing security and trustworthiness.
- **Flexibility in Deadlines:** Decentrawill offers unparalleled flexibility in setting deadlines for will execution, ranging from days to years, unlike the rigid six-month period seen in similar projects.
- **Multi-Cryptocurrency Support:** While CryptoWill limits users to one cryptocurrency, Decentrawill is designed to support multiple cryptocurrencies, increasing its utility and accessibility.

## Motivation

The motivation behind Decentrawill stems from a desire to address the prevalent issues in the traditional will-making process, such as notary fraud and the inefficient transfer of assets. Our aim is to streamline this process, making it faster, more secure, and less costly for individuals to leave their possessions to their chosen successors.

## Target Audience

Decentrawill is built for anyone looking to secure their legacy in a transparent, secure, and efficient manner. It caters to individuals who wish to leverage blockchain technology for the seamless transfer of their assets according to their precise wishes.

## Planned MVP Features

- **Smart Contract(s):** For creating, modifying, and setting conditions for wills.
- **User Interface:** A clean, intuitive UI for users to interact with the smart contracts easily.
- **Decentralized vs. Traditional:** An informational section highlighting the benefits of using Decentrawill over traditional methods.

## Reach Goals

- **Encryption Option:** For users who prefer privacy concerning their will's terms.
- **Notifications:** Alerts for users and recipients about important deadlines or modifications to the will.
- **ID Verification:** Implementing a robust user identification system to further secure will transactions.
- **Monetization:** Exploring viable options for monetizing Decentrawill while maintaining user trust and value.

## Tools Used

- **Frontend:** ReactJS for a dynamic and responsive user experience.
- **Backend:** NodeJS for server-side operations and API interactions, including Plaid for identity verification.
- **Smart Contract Development:** Solidity for writing smart contracts, with Hardhat and Remix for development and testing purposes.

## Teamwork

- **Frontend Development:** Jassem will lead the design efforts, with Daniel providing support for integrating the smart contract interactions.
- **Backend Development:** Both Daniel and Jassem will collaborate on backend development tasks.
- **Smart Contract Development:** Daniel will spearhead the smart contract development, with Jassem assisting in certain aspects.

Decentrawill is not just a project; it's a step towards redefining how wills are perceived and executed in the digital age. By prioritizing security, transparency, and user autonomy, we aim to provide a solution that respects the wishes of the deceased while making the process as straightforward and fraud-proof as possible for the successors.

## Getting Started

### Prerequisites

Before running this project, make sure you have Node.js, git CLI, and npm installed. You can check by running:
node -v
npm -v
git --version

### Installation & Setup

1. Clone the repository
   git clone [repository URL] cd [local repository]

Install Dependencies
Run the following command from inside the project directory to install the required libraries and dependencies:
npm install
This command installs dependencies including bootstrap, ethers, firebase, react, and react-router-dom

2. Register on Firebase

3. Create a Firebase project

4. Add Authentication for Google and Email providers/sign in methods

5. Create a web app by going to Project settings (from the gear icon next to Project Overview). Then go to Your Apps and hit Add app. Make sure to copy firebaseConfig segment in the code snippet that they provide you with.

6. Back in your coding environment, run npm install firebase.

—--
Ignore the hyphenated steps for now
-Run firebase init and choose Hosting, …
-Run firebase login on terminal
-Login with registered account
-Allow Firebase CLI access to your account
-After successful authentication, the terminal will show the message “Success!”
—--

7. Then, navigate to decentrawill/src/firebase/Firebase.js (rename Firebase.example.js to Firebase.js first) where you will replace the existing firebaseConfig with the one you were provided with.

const firebaseConfig = {
apiKey: '’',
authDomain: '',
projectId: '',
storageBucket: ‘',
messagingSenderId: '',
appId: '',
measurementId: '',
};

### Running the Application

After setting up the firebase.js and having the dependencies installed you can start the application by running:
npm start This command runs the app in development mode. Open http://localhost:3000 to view it in the browser in the default case where the backend is already running on port 3000.
