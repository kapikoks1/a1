<?php
/** @var $book ?\App\Model\Book */
?>

<div class="form-group">
    <label for="subject">Title</label>
    <input type="text" id="subject" name="book[subject]" value="<?= $book ? $book->getSubject() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Description</label>
    <textarea id="content" name="book[content]"><?= $book? $book->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>