export const generatePassword = (name) => {
    const randomNumber = Math.floor(
        1000 + Math.random() * 9000
    );

    const symbols = ["@", "!", "#", "$"];

    const symbol =
        symbols[Math.floor(Math.random() * symbols.length)];

    return `${name}${randomNumber}${symbol}`;
};