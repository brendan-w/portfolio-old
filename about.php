<!doctype html>
<!-- Brendan Whitfield -->

<?php
	//get the data file, and decode the json
	$data = file_get_contents("data.json");
	$json = json_decode($data, true);
	$projects = $json["about"];
?>

<html>
	<head>
		<title>Brendan Whitfield | About</title>

		<?php require "req_head.php"; ?>

	</head>
	<body onunload=''>
		<div class='header'>
			<?php require "req_header.php"; ?>
			<!-- Navpath bar -->
			<nav class='navpath'>
				<a href='index.php' class='pathitem'>HOME</a>
				<div class='pathsep'>/</div>
				<a href='about.php' class='pathitem currentpage'>ABOUT ME</a>
				<div class='pathsep hidden'>/</div>
			</nav>
		</div>
		<div class='content'>
			<div class='project about'>
				<h2 class='title'>HI THERE!</h2>
				<img class='right' src='media/me.bmp' alt='picture of Brendan Whitfield' height=258 width=200 />
				<p>My name is Brendan Whitfield, and I am a programmer and software developer. I am currently a freshman majoring in New Media Interactive Developement at Rochester Institute of Technology. I enjoy almost everything code related, and have a passion for designing complex systems and mechanisms. While my major focuses more on interfaces and interactive systems, I am equally interested in what goes on behind the scenes. File compression, sorting algorithms and cryptography are all topics that I care about. In the coming years, I hope to learn more languages (such as C++, C#, and Assembly), and learn more about interface design and algorithm analysis. </p>
				<p>In my spare time, I can be found writing software, biking, or playing guitar. I also have a strong passion for woodworking, and am currently constructing my 3rd pipe organ (no joke). I currently work as a glass artist at a local shop here in Rochester, and I do torch-work for several of the pieces we produce. </p>
			</div>


			<?php
				//start looping through projects
				foreach($projects as $name => $proj)
				{
			?>

			<a href='about_project.php?project=<?php echo $name; ?>' class='project'>
				<h2 class='title'><?php echo $proj["displayName"]; ?></h2>
				<img src='<?php echo $proj["listImage"]; ?>' alt='image of <?php echo $proj["displayName"]; ?>' height=200 width=800 />
			</a>

			<?php
				} //end of loop, iterate again
			?>

			<!-- Json file isn't set up for hardlinks, so here's a special one -->
			<a href='https://people.rit.edu/bcw7044/webdev-309/exercises/portfolio/dce/' class='project'>
				<h2 class='title'>DCE Authentication</h2>
				<img src='media/l_locked.png' alt='image of padlock' height=200 width=800 />
			</a>

		</div>

		<?php require "req_footer.php"; ?>

		<script type="text/javascript" src='js/about.js'></script> <!-- $(window).load() -->
	</body>
 </html>