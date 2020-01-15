<?php

/**
 * Plugin Name:         Post Blocks
 * Plugin URI:          https://github.com/ryannutt/wordpress-post-blocks
 * Description:         Adds a column to the post table that lists what blocks the post is using.
 * Version:           0.2.0
 * Requires at least:   5.2
 * Requires PHP:        7.2
 * Author:              Ryan Nutt
 * Author URI:          https://www.nutt.net
 * License:             GPL v2 or later
 * License URI:         https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:         aelora-post-blocks
 * Domain Path:         /lang
 */

namespace Aelora\WordPress\PostBlocks;

Post_Blocks::init();

class Post_Blocks
{
    public static function init()
    {
        $cpt_list = get_post_types();
        $cpt_ignore = apply_filters('aelora_post_blocks_ignore', ['attachment', 'revision', 'nav_menu_item', 'custom_css', 'customize_changeset', 'oembed_cache', 'user_request', 'wp_block']);

        foreach ($cpt_ignore as $k => $v) {
            if (array_key_exists($v, $cpt_list)) {
                unset($cpt_list[$v]);
            }
        }

        if (!empty($cpt_list)) {
            foreach ($cpt_list as $cpt) {
                add_filter('manage_' . $cpt . 's_columns', [self::class, 'manage_posts_columns']);
                add_filter('manage_' . $cpt . '_posts_custom_column', [self::class, 'column'], 10, 2);
            }
        }

        if (!class_exists('Smashing_Updater')) {
            include_once(plugin_dir_path(__FILE__) . 'updater.php');
        }
        $updater = new Smashing_Updater(__FILE__);
        $updater->set_username('ryannutt');
        $updater->set_repository('wordpress-post-blocks');

        $updater->initialize();
    }

    public static function manage_posts_columns($columns)
    {
        $columns['post_blocks'] = __('Blocks', 'aelora-post-blocks');
        return $columns;
    }

    public static function column($column, $post_id)
    {
        if ('post_blocks' === $column) {
            $post = get_post($post_id);
            if (has_blocks($post->post_content)) {
                $blocks = parse_blocks($post->post_content);

                $count = [];

                if (!empty($blocks)) {
                    foreach ($blocks as $k => $v) {
                        if (!empty($v['blockName'])) {
                            if (!array_key_exists($v['blockName'], $count)) {
                                $count[$v['blockName']] = 1;
                            } else {
                                $count[$v['blockName']]++;
                            }
                        }
                    }
                    if (!empty($count)) {
                        ksort($count);
                        foreach ($count as $block => $uses) {
                            echo $block . ' (' . $uses . ')<br>';
                        }
                    }
                }
            }
        }
    }
}
