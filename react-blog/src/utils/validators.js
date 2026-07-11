export const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return "Email is required";
    if (!re.test(String(email).toLowerCase())) return "Invalid email address format";
    return true;
};

export const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    return true;
};

export const validateName = (name) => {
    if (!name) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters long";
    return true;
};

export const validateBlogTitle = (title) => {
    if (!title) return "Title is required";
    if (title.trim().length < 5) return "Title must be at least 5 characters long";
    if (title.length > 100) return "Title cannot exceed 100 characters";
    return true;
};
