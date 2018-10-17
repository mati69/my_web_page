<?php

header("Content-Type: application/json; charset=UTF-8");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Html2Text\Html2Text\Html2Text;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';
require 'html2text/src/Html2Text.php';

if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message']) && isset($_POST['hon'])){

    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    $antiSpam = $_POST['hon'];
    
    $name = trim($name);
    $email = trim($email);
    
    $regName = "/^\S[a-zA-ZąĄćĆęĘłŁńŃóÓśŚżŻźŹ ]+$/";
    $regEmail = "/^[0-9a-zA-Z_.-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,}$/";
    
    $errors = Array();
	$return = Array();
    
    if (empty($name) || !preg_match($regName, $name)){
        
        array_push($errors, 'name');
    }
    
    if (empty($email) || !preg_match($regEmail, $email)){
        
        array_push($errors, 'email');
    }
    
    if (empty($message)){
        
        array_push($errors, 'message');
    }
    
    if (count($errors) > 0){
        
        $return['errors'] = $errors;
        
    } else if (empty($antiSpam)){
        
        $mail = new PHPMailer(true);                              // Passing `true` enables exceptions
        
        $mail->CharSet = "UTF-8";
        
        try {
            //Server settings
            //$mail->SMTPDebug = 2;                               // Enable verbose debug output
            $mail->isSMTP();                                      // Set mailer to use SMTP
            $mail->Host = '**********';                           // Specify main and backup SMTP servers
            $mail->SMTPAuth = true;                               // Enable SMTP authentication
            $mail->Username = '**********';                       // SMTP username
            $mail->Password = '**********';                       // SMTP password
            $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
            $mail->Port = 587;                                    // TCP port to connect to

            //Recipients
            $mail->setFrom('**********@**********.****', 'WWW');
            $mail->addAddress('**********@**********.****');      // Add a recipient
            // $mail->addAddress('ellen@example.com');            // Name is optional
            $mail->addReplyTo($email, $name);
            // $mail->addCC('cc@example.com');
            // $mail->addBCC('bcc@example.com');

            //Attachments
            // $mail->addAttachment('/var/tmp/file.tar.gz');      // Add attachments
            // $mail->addAttachment('/tmp/image.jpg', 'new.jpg'); // Optional name

            //Content
            $mail->isHTML(true);                                  // Set email format to HTML
            $mail->Subject = 'Wiadomość ze strony - '.$name.' <'.$email.'>';
            
            $mail->Body =
                "<html>
                    <head>
                        <meta charset=\"UTF-8\">
                    </head>
                    <style type=\"text/css\">
                        body {font-family: arial; padding: 20px;}
                        div {margin-bottom: 10px;}
                        .msg-title {margin-top: 30px;}
                    </style>
                    <body>
                        <div>Podpis: <strong>$name</strong></div>
                        <div>E-mail: <a href=\"mailto:$email\">$email</a></div>
                        <div class=\"msg-title\"><strong>Wiadomość:</strong></div>
                        <div>$message</div>
                    </body>
                </html>";
            
            $html = new \Html2Text\Html2Text($mail->Body);
            
            $mail->AltBody = $html->getText();

            if ($mail->send()){
            
                $return['status'] = 'ok';
            
            } else {
            
                $return['status'] = 'error';
            }
            
        } catch (Exception $e) {
            //echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
        }
        
    } else {
        
        $return['status'] = 'ok';
    }

    echo json_encode($return);
    
} else header("Location: index.html");

?>
