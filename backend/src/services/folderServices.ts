export const FOLDER_NAME_MAX_LENGTH = 100;

// Checks length of name
export const checkLength = (name: string): boolean => {
    return name.length > FOLDER_NAME_MAX_LENGTH;
}