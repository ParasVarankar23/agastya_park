export const capitalize = (text) => {
    if (!text) return "";

    return text
        .toLowerCase()
        .replace(
            /\b\w/g,
            (char) => char.toUpperCase()
        );
};

export const formatCurrency = (
    amount
) => {
    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        }
    ).format(amount);
};

export const formatDate = (
    date
) => {
    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }
    );
};

export const getCurrentMonth = () => {
    return new Date().toLocaleString(
        "default",
        {
            month: "long",
        }
    );
};

export const getCurrentYear = () => {
    return new Date().getFullYear();
};

export const getCurrentDate = () => {
    return new Date()
        .toISOString()
        .split("T")[0];
};

export const getCurrentDateTime =
    () => {
        return new Date();
    };