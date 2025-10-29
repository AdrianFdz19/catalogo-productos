

export const handleError = (err, req, res, next) => {

    console.error(err); // imprimimos el error en consola para depuración
    const status = res.status || 500;

    res.status(status).json({
        success: false,
        message: res.message || 'Server internal error.',
        error: err
    });
};