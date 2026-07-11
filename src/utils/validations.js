export const validateEmail = (email) => {
    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
};

export const validatePhone = (phone) => {
    const regex = /^[6-9]\d{9}$/;

    return regex.test(phone);
};

export const validatePassword = (
    password
) => {
    return password.length >= 8;
};

export const validateRequiredFields = (
    data,
    fields
) => {
    for (const field of fields) {
        if (
            !data[field] ||
            data[field].toString().trim() === ""
        ) {
            return {
                success: false,
                message: `${field} is required`,
            };
        }
    }

    return {
        success: true,
    };
};

export const validateRoomNumber = (
    roomNumber
) => {
    return roomNumber.trim().length > 0;
};

export const validatePositiveNumber = (
    value
) => {
    return (
        !isNaN(value) && Number(value) >= 0
    );
};