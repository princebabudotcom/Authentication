// welcome.template.js

const welcomeTemplate = ({ name, loginUrl }) => {
  return `
    <h1>Welcome ${name}</h1>

    <p>
      Your account was created successfully.
    </p>

    <a href="${loginUrl}">
      Login Now
    </a>
  `;
};

export default welcomeTemplate;
