export function validatePhoneNumber(phone: string) {
    const cleaned = phone.replace(/[\s()-]/g, '').replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+380')) {
        const digits = cleaned.slice(4);
        if (digits.length <= 2) return `+380${digits}`;
        if (digits.length <= 5) return `+380${digits.slice(0, 2)}${digits.slice(2)}`;
        if (digits.length <= 7)
            return `+380${digits.slice(0, 2)}${digits.slice(2, 5)}${digits.slice(5)}`;
        return `+380${digits.slice(0, 2)}${digits.slice(2, 5)}${digits.slice(5, 7)}${digits.slice(
            7,
            9
        )}`;
    } else if (cleaned.startsWith('0')) {
        const digits = cleaned.slice(1);
        if (digits.length <= 2) return `0${digits}`;
        if (digits.length <= 5) return `0${digits.slice(0, 2)}${digits.slice(2)}`;
        if (digits.length <= 7)
            return `0${digits.slice(0, 2)}${digits.slice(2, 5)}${digits.slice(5)}`;
        return `0${digits.slice(0, 2)}${digits.slice(2, 5)}${digits.slice(5, 7)}${digits.slice(
            7,
            9
        )}`;
    }
    return cleaned;
}
