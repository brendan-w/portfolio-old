<!doctype html>
<!-- Written and Designed by Brendan Whitfield -->

<?php
	$prefix = "../../";
?>

<html>
	<head>
		
	<?php require($prefix.'REQ_HEAD.php'); ?>

	</head>
	<body onunload=''>

		<?php require($prefix.'REQ_HEADER.php'); ?>

		<section class='m'>
			<div class='w1'>
				<p>
					This woodworking tool finds cut patterns that keep wasted lumber to a minimum. After accepting length and quantity data from the user, a cut pattern is generated, and the layout is displayed in friendly color-coded segments.
				</p>
				<div class='bar h'>
					<div class='graphics h'></div>
					<span>Lumber Layout Tool</span>
					<span class='dim'>Javascript / jQuery</span>
					<a class='button' href='../../tools/lumber/'>Run</a>
				</div>
				<div class='code bar h'>
					<div class='graphics h'></div>
					<span class='dim'>GitHub</span>
					<a class='button' href='https://github.com/brendanwhitfield/lumber_segmenter'>Code</a>
				</div>
				<p>
					The largest challenge, by far, was crafting the algorithms that solve for the layout. There are in fact three solvers available. One solver recursively searches for the layout with the least loss, while the remaining two use different, less brute force, techniques to find layouts. The recursive solver is garaunteed to return an optimal layout, however, it is not always practical due to its slow speeds with large inputs. At this point, the two other solvers may be used to generate sub-optimal solutions. For simplicity, this descision can be made automatically by placing the tool in "auto" mode.
				</p>
			</div>
			<div class='w2'>
				<a href='lumber.png'>
					<img src='small_lumber.png' height='376' width='450' />
				</a>
				<span class='dim'>Click to enlarge</span>
			</div>
		</section>

		<?php require('../../REQ_FOOTER.php'); ?>

	</body>
 </html>