export const getDomainUrl = () => {
    return "http://ec2-18-232-182-164.compute-1.amazonaws.com/okc-couriers"
}

export const updateSnackbar = (text,color="error") => {
    var snackbar = {}
    snackbar.value = true;
    snackbar.color = color;
    snackbar.text = text;
    return snackbar;
}