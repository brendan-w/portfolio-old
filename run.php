<!doctype html>
<!-- Brendan Whitfield -->

<?php
	//find the selected project from the GET variable
	$input = $_GET["project"];

	//get the data file, and decode the json
	$data = file_get_contents("data.json");
	$json = json_decode($data, true);
	$projects = $json["projects"];
	//get the correct project out of the array
	$project = $projects[$input];
?>

<html>
	<head>
		<title>Brendan Whitfield | <?php echo $project["displayName"]?></title>

		<?php require "req_head.php"; ?>

	</head>
	<body onunload=''>

		<div class='header'>

			<?php require "req_header.php"; ?>

			<!-- Navpath bar -->
			<nav class='navpath'>
				<a href='index.php' class='pathitem'>HOME</a>
				<div class='pathsep'>/</div>
				<a href='projects.php' class='pathitem'>PROJECTS</a>
				<div class='pathsep'>/</div>
				<a href='project.php?project=<?php echo $input; ?>' class='pathitem currentpage'><?php echo $project["displayName"]; ?></a>
			</nav>
		</div>
		<div class='content'>
			<section class='exe'>
				<embed src='' alt='<?php echo $project["executable"]; ?>' height=<?php echo $project["exeHeight"]; ?> width=<?php echo $project["exeWidth"]; ?> >
			</section>
			<section class='exe'>
				<h3 class='left'>Please be patient, some projects need time to load</h3>
				<a href='project.php?project=<?php echo $input; ?>' class='button right'>BACK</a>
			</section>
		</div>

		<?php require "req_footer.php"; ?>

		<script type="text/javascript" src='js/run.js'></script> <!-- $(window).load() -->
	</body>
 </html>