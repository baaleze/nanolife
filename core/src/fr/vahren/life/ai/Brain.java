package fr.vahren.life.ai;

/**
 * Class chere the intelligence resides.
 * This brain can learn and decide. It can also be cloned.
 */
public abstract class Brain<I,O> implements Cloneable
{

    public abstract O decide(I input);

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
