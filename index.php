<!doctype html>
<!-- Brendan Whitfield -->
<html>
	<head>
		<title>Brendan Whitfield</title>
		<?php require "req_head.php"; ?>
		<style>
			html{overflow:hidden;}
			nav.navpath{opacity:0;}
		</style>
	</head>
	<body onunload=''>
		<div class='header'>
			<?php require "req_header.php"; ?>
			<!-- Navpath bar (for seemless transition only, no functionality here)  -->
			<nav class='navpath'>
				<a href='index.php' class='pathitem'>HOME</a>
				<div class='pathsep'>/</div>
			</nav>
		</div>
		<div class='content'>
			<nav class='menu'>
				<a href='projects.php' class='menuitem'>PROJECTS</a>
				<a href='about.php' class='menuitem'>ABOUT ME</a>
			</nav>
		</div>
		<?php require "req_footer.php"; ?>
		<script type="text/javascript" src='js/home.js'></script> <!-- where the party starts ($(window).load()) -->
	</body>
 </html>