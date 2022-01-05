<?php

namespace imonroe\corpora;

class Corpora
{

    /**
     * @var string $data_location
     *   The location of the data files.
     */
    protected $data_location;

    public function __construct()
    {
        $package_base_directory = __DIR__ . trim("/../ ");
        if (!is_dir($package_base_directory . 'data')) {
            die("Could not find the corpora data files directory.");
        }
        $this->data_location = $package_base_directory . 'data';
    }

    /**
     * Gets a JSON file from the corpora.
     *
     * @param string $requested_file
     *  The file you want in the form of "dirname.dirname.filename"
     */
    public function getDataFile(string $requested_file): array
    {
        $request_array = explode('.', $requested_file);
        if (!is_array($request_array)) {
            throw new \Exception('The requested file was not in the correct format.');
        }
        $filename = array_pop($request_array) . ".json";
        $path = $this->data_location;
        foreach ($request_array as $subdir) {
            $path .= '/' . $subdir;
        }
        $path .= '/' . $filename;

        if (!is_file($path)) {
            throw new \Exception('The requested file could not be found.');
        }

        $json = file_get_contents($path);
        return json_decode($json, true);
    }

    /**
     * Returns an array of categories (directories) in the corpus.
     *
     *
     */
    public function getCategories(): array
    {
        return array_diff(scandir($this->data_location), array('..', '.'));
    }

    /**
     * Returns an array of subcategories for a given category.
     *
     *
     * @param string $category
     *   A legitimate category in the corpus.
     */
    public function getSubcategories(string $category): array
    {
        if (empty($category)) {
            throw new \Exception('No corpus category specified.');
        }
        return array_diff(scandir($this->data_location . '/' . $category), array('..', '.'));
    }

    /**
     * Returns a description of the data, if one is available.
     *
     * @param string $requested_file
     *   The requested data from the corpus.
     */
    public function getDescription(string $requested_file): string
    {
        $data = $this->getDataFile($requested_file);
        if (empty($data['description'])) {
            return 'No description available.';
        }
        return $data['description'];
    }
}
