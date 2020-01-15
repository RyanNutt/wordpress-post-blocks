## Post Blocks Plugin

This simple little plugin started out life when I needed a way to easily [figure out what posts used a specific block](https://www.nutt.net/how-to-find-all-wordpress-posts-using-a-block/). Originally I used WP-CLI to just run a query, but I wanted something a little more generic. 

What this does is add a column to most post types that lists all of the blocks that are used in that post along with how many times that block is used. For example, if you have a paragraph the column will show `core/paragraph` in the post list table. 

## Installation

Download the [latest release](https://github.com/ryannutt/wordpress-post-blocks/releases)

Login to your WordPress site and click on Plugins > Add New

Click on the Upload button and upload the zip file you downloaded from GitHub

Activate the plugin

## Settings

There aren't any. Blocks will start showing up in the posts and pages list. 