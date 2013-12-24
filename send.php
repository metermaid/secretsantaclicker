<?php
  $ritamail = "rita@ritacheng.com";
  $subject = "Secret Santa Clicker";
  $clicks = $_POST['clicks']; 
  $coops = $_POST['coops']; 
  $fters = $_POST['fters']; 

  $body 					 = "Clicks: $clicks \n Coop students: $coops \n Full timers: $fters";
  mail($ritamail, $subject, $body);
  echo "Your email was sent!"; // success message  
?>