<!doctype html>
<!-- Brendan Whitfield -->

<?php
	//get the data file, and decode the json
	$data = file_get_contents("data.json");
	$json = json_decode($data, true);
	$projects = $json["projects"];
?>

<html>
	<head>
		<title>Brendan Whitfield | Projects</title>

		<?php require "req_head.php"; ?>

	</head>
	<body onunload=''>
		<div class='header'>
			<?php require "req_header.php"; ?>
			<!-- Navpath bar -->
			<nav class='navpath'>
				<a href='index.php' class='pathitem'>HOME</a>
				<div class='pathsep'>/</div>
				<a href='projects.php' class='pathitem currentpage'>PROJECTS</a>
				<div class='pathsep hidden'>/</div>
			</nav>
		</div>
		<div class='content'>

			<?php
				//start looping through projects
				foreach($projects as $name => $proj)
				{
			?>

			<a href='project.php?project=<?php echo $name; ?>' class='project'>
				<h2 class='title'><?php echo $proj["displayName"]; ?></h2>
				<img src='<?php echo $proj["listImage"]; ?>' alt='image of <?php echo $proj["displayName"]; ?>' height=200 width=800 />
			</a>

			<?php
				} //end of loop, iterate again
			?>

		</div>

		<?php require "req_footer.php"; ?>

		<script type="text/javascript" src='js/projects.js'></script> <!-- $(window).load() -->
	</body>
 </html>