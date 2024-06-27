<div class="VacaturesComponent">
    <?php $text = get_sub_field('title'); ?>

    <div class="the_content component-title-block">
        <?php echo $text;

        ButtonsComponent::display(); ?>
    </div>

    <?php $vacatures = get_sub_field('job_offers');

    if ($vacatures) { ?>
        <div class="vacatures" data-cursor-target data-job-offers>
            <?php
            foreach ($vacatures as $vacature) { ?>
                <div class="vacature <?php if ($vacature == 114) :
                    echo 'special';
                                     endif; ?>" data-thumbnail-url="<?php echo get_the_post_thumbnail_url($vacature) ?>">
                    <span class="title">
                    <?php echo get_the_title($vacature) ?>
                    </span>

                    <div class="vacature-info">
                        <span class="hours"><?php echo get_field('worktimes', $vacature) ?></span>
                        <span class="location"><?php echo get_field('location', $vacature) ?></span>
                    </div>
                </div>
            <?php } ?>
        </div>
    <?php } ?>
</div>