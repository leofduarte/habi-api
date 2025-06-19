const filterSensitiveUserData = (user) => {
    if (!user) return null;
    
    const {
        password,
        verificationCode,
        codeExpiry,
        failedLoginAttempts,
        loginJailUntil,
        is_admin,
        is_active,
        last_login,
        notification_preferences,
        timezone_name,
        timezone_offset,
        ...safeUserData
    } = user;

    return safeUserData;
};

module.exports = {
    filterSensitiveUserData
}; 