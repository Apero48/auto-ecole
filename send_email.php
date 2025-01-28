<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    // Configuration du serveur
    $mail->isSMTP();
    $mail->Host = 'smtp.example.com'; // Remplacez par votre serveur SMTP
    $mail->SMTPAuth = true;
    $mail->Username = 'raoufni48@example.com'; // Votre adresse e-mail
    $mail->Password = 'Apero@200'; // Votre mot de passe
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // Destinataires
    $mail->setFrom('raoufni48@example.com', 'Nom');
    $mail->addAddress('raoufni48@example.com'); // Remplacez par l'adresse e-mail du destinataire

    // Contenu
    $mail->isHTML(true);
    $mail->Subject = 'Nouveau message de contact';
    $mail->Body    = "Nom: $name<br>Email: $email<br>Téléphone: $phone<br>Message: $message";

    $mail->send();
    echo 'Message envoyé avec succès';
} catch (Exception $e) {
    echo "Le message n'a pas pu être envoyé. Erreur: {$mail->ErrorInfo}";
}
?>