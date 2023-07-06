export const getDomainUrl = () => {
    return "http://ec2-54-82-47-157.compute-1.amazonaws.com/okc-couriers/"
}

export const updateSnackbar = (text,color="error") => {
    var snackbar = {}
    snackbar.value = true;
    snackbar.color = color;
    snackbar.text = text;
    return snackbar;
}