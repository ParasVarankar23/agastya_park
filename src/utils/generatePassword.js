export const generatePassword = (
    name = "Admin"
) => {
    const firstName = name
        .trim()
        .split(" ")[0];

    const random = Math.floor(
        1000 + Math.random() * 9000
    );

    return `${firstName}@${random}`;
};