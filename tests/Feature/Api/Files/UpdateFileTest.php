<?php

namespace Tests\Feature\Api\Files;

use Illuminate\Http\Response;
use Tests\RequiresAuth;
use Tests\TestCase;

class UpdateFileTest extends TestCase
{
    use RequiresAuth;

    protected $endpoint = '/api/files';

    /**
     * @test
     * @group broken-travis
     */
    public function authed_user_can_update_file(): void
    {
        $args = ['file' => resource_path('test-skel/updating.html')];

        file_put_contents($args['file'], 'empty');
        $file = $this->authed()->getJson($this->endpoint($args))->json();

        $response = $this->authed()->putJson($this->endpoint($args), [
            'contents' => 'File updated!',
        ]);

        $response->assertOk();
        $this->assertIsArray($response->json());

        $response->assertJsonStructure([
            'filename', 'filepath', 'mimetype', 'isDir', 'isFile',
            'isLink', 'target', 'owner', 'group', 'perms',
        ]);
        $response->assertJsonFragment([
            'contents' => 'File updated!',
            'filename' => 'updating.html',
            'filepath' => resource_path('test-skel'),
            'mimetype' => 'text/plain',
            'isFile' => true,
        ]);

        unlink($args['file']);
    }

    /** @test */
    public function updating_file_requires_filename(): void
    {
        $response = $this->authed()->putJson($this->endpoint(['file' => '']));

        $response->assertJsonCount(1, 'errors');
        $response->assertJsonValidationErrors(['file']);
        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
        $this->assertEquals('File path must be specified.', $response['errors']['file'][0]);
    }

    /** @test */
    public function nonexistant_files_return_not_found_error(): void
    {
        $response = $this->authed()->putJson($this->endpoint(['file' => '/tmp/nothere.txt']), [
            'contents' => "This shouldn't be saved.",
        ]);

        $response->assertStatus(Response::HTTP_NOT_FOUND);
        $response->assertJsonStructure(['error' => ['code', 'msg']]);
        $response->assertJsonFragment(['code' => 404, 'msg' => 'File not found']);
    }

    /** @test */
    public function cannot_save_file_with_identical_contents(): void
    {
        $args = ['file' => resource_path('test-skel/editme.txt')];
        $response = $this->authed()->putJson($this->endpoint($args), [
            'contents' => "test file for testing edits\n",
        ]);

        $response->assertStatus(Response::HTTP_NOT_MODIFIED);
    }
}
