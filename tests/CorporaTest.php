<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;
use imonroe\corpora\Corpora;

final class CorporaTest extends TestCase
{

    private $corpora;

    public function setUp(): void
    {
        $this->corpora = new Corpora();
    }

    public function testObjectCreation(): void
    {
        $this->assertInstanceOf(Corpora::class, $this->corpora);
    }

    public function testGetDataFile(): void
    {
        $nouns_array = $this->corpora->getDataFile('words.nouns');
        $this->assertIsArray($nouns_array);
        $this->assertEquals('A list of English nouns.', $nouns_array['description']);
        $this->assertContains('Armour', $nouns_array['nouns']);
    }

    public function testGetDescription(): void
    {
        $this->assertEquals('A list of English nouns.', $this->corpora->getDescription('words.nouns'));
    }

    public function testGetDataFileWrongDataException(): void
    {
        $this->expectExceptionMessage("The requested file could not be found.");
        $obj = $this->corpora->getDataFile('foo.bar');
    }

    public function testGetDataFileNoDataException(): void
    {
        $this->expectError(\ArgumentCountError::class);
        $obj = $this->corpora->getDataFile();
    }

    public function testGetCategories(): void
    {
        $categories = $this->corpora->getCategories();
        $this->assertIsArray($categories);
        $this->assertContains('words', $categories);
    }

    public function testGetSubcategories(): void
    {
        $categories = $this->corpora->getCategories();
        foreach ($categories as $category) {
            $this->assertIsArray($this->corpora->getSubcategories($category));
        }
        //var_export($this->corpora->getSubcategories('words'));
        $this->assertContains('proverbs.json', $this->corpora->getSubcategories('words'));
    }
}
