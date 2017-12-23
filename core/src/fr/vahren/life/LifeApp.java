package fr.vahren.life;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;

public class LifeApp extends ApplicationAdapter {
	public static final int WIDTH = 800;
    public static final int HEIGHT = 800;

	SpriteBatch batch;
	Pixmap p;
	Texture img;

	private LifeWorld world;
	
	@Override
	public void create () {
		batch = new SpriteBatch();
		p = new Pixmap(WIDTH,HEIGHT, Pixmap.Format.RGB888);
		world = new LifeWorld(2);
		world.addLife(6);
	}

	@Override
	public void render () {
	    world.update();

		Gdx.gl.glClearColor(1, 0, 0, 1);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
        p.setColor(Color.WHITE);
        p.fill();
		// build Pixmap
        world.render(p);

		batch.begin();
		batch.draw(new Texture(p), 0, 0);
		batch.end();
	}
	
	@Override
	public void dispose () {
		batch.dispose();
	}
}
