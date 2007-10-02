<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $data = $_POST['data'];
  print('method: post, data: '.$data);
}
else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  print('method: get');
}


?>
