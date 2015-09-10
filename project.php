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
				<a href='' class='pathitem currentpage'><?php echo $project["displayName"]; ?></a>
			</nav>
		</div>
		<div class='content'>
			<section>
				<div class='nameplate'>
					<?php echo $project["displayName"]; ?>
					<br>
					<h3><?php echo $project["language"]; ?></h3>
				</div>
			</section>
			<section>
				<img src='<?php echo $project["mainImage"]; ?>' alt='image of <?php echo $project["displayName"]; ?>' />
			</section>
			<section>
				
				<?php
					$run = $project["executable"];
					if(strlen($run) > 0)
					{
				?>

				<a href='run.php?project=<?php echo $input; ?>' class='button right'>CLICK TO RUN</a>

				<?php
					}

					$lText = $project["lText"];
					if(strlen($lText) > 0)
					{
				?>

				<p class='left'><?php echo $project["lText"]; ?></p>

				<?php
					}

					$rText = $project["rText"];
					if(strlen($rText) > 0)
					{
				?>

				<p class='right'><?php echo $project["rText"]; ?></p>

				<?php
					}
				?>

			</section>
		</div>

		<?php require "req_footer.php"; ?>

		<script type="text/javascript" src='js/project.js'></script> <!-- $(window).load() -->
	</body>
 </html>