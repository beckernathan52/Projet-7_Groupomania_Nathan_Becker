// Vérification de l'email
function validEmail() {
    this.error.MsgEmail = ""
    //eslint-disable-next-line
    if (! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.dataForm.email) || this.dataForm.email === null) {
        this.error.MsgEmail = "Email au format invalide!"
        return false
    }
    return true
}

// Vérification du mot de passe
function validPassword() {
    this.error.MsgPassword=""
    /* Vérifie le format du mot de passe */
    if (! /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_#])([-+!*$@%_#\w]{8,20})$/.test(this.dataForm.password) || this.dataForm.password === null) {
        this.error.MsgPassword = "Mot de passe au format invalide, il doit contenir entre 8 et 20 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial (-+!*$@%_#)."
        return false
    }
    return true
}

function validText() {
    this.error.MsgText = ""
    if (!this.dataForm.text?.trim()) {
        this.error.MsgText = "Ce champ est obligatoire !"
        return false
    }
    return true
}

function formattingDate(post) {
    post.createdAt = post.createdAt.split('.')[0]
    const hours = post.createdAt.split('T')[1]
    const date = post.createdAt.split('T')[0]
    post.createdAt = date + " à " + hours
}




export {validEmail, validPassword, formattingDate, validText}
